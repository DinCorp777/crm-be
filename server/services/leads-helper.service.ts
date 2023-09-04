import { Leads, Location, Roles, User } from "../models";
import { google } from "googleapis";
import OAuthService from "./oAuth.service";
import { IUser } from "../../types/user";
import NotificationHelperService from "./notification-helper.service";
import MailService from "./mail.service";
import moment from "moment";
import "moment-timezone";

export class LeadsHelperService {


  private async getAvailableEmployees(timeTxt, cxName, address, user, notes) {
    return new Promise(async (resolve, reject) => {
      try {

        // parsing the time into date constructor, bcz we getting in text format --> 27 May 2023
        let time = new Date(Date.parse(timeTxt));
        time = new Date(time.getTime() + 0 * 60 * 60 * 1000);

        // adding 1.5hrs to the end time here
        let endTime = new Date(time.getTime() + 1.5 * 60 * 60 * 1000);


        const records = await User.find({
          hasCalId: true,
          locationId: user?.locationId,
          roleId: { $ne: "6425796a73e386a02cb01199" },
          available: true,
        });

        const availEmployees = [];
        const repCountUser = [];
        let eventsToday = 0;

        for (let i = 0; i < records.length; i++) {
          const record = records[i];
          repCountUser.push(record);

          const events: any = await this.getEvents(
            record?.calId,
            time.toISOString(),
            endTime.toISOString(),
            10
          );
          // console.log("events ->", events.data?.items);÷

          if (!events?.data?.items || events.data.items.length === 0) {
            record.eventsToday = eventsToday;
            availEmployees.push(record);
          }
        }


        resolve(availEmployees);
      } catch (err) {
        reject(err);
      }
    });
  }


  // assign appointment to the user ( for setter )
  public async assign(timeTxt, cxName, address, user, notes) {
    return new Promise(async (resolve, reject) => {
      try {
        let id = await this.assignAppointmentToUser(
          timeTxt,
          cxName,
          address,
          user,
          notes
        );
        resolve(id);
      } catch (err) {
        return reject(err);
      }
    });
  }

  // assigning appointments to user, using the round robin, priority wise
  private async assignAppointmentToUser(timeTxt, cxName, address, user, notes) {
    return new Promise(async (resolve, reject) => {
      try {
        let time = new Date(Date.parse(timeTxt));
        time = new Date(time.getTime() + 0 * 60 * 60 * 1000);
        let endTime = new Date(time.getTime() + 1.5 * 60 * 60 * 1000);

        const availEmployees: any = await this.getAvailableEmployees(timeTxt, cxName, address, user, notes);

        // console.log("availEmployees ->", availEmployees)

        if (availEmployees.length > 0) {
          availEmployees.sort(function (a, b) {
            return parseFloat(b?.priority) - parseFloat(a?.priority);
          });

          const biggest = availEmployees.reduce(function (highest, count) {
            return highest?.priority < count?.priority && count?.count > 0
              ? highest
              : count;
          }, 0);

          const biggest_ = availEmployees.reduce((acc, item) => {
            if (item?.count > 0 && item.priority < acc.priority) {
              return item;
            }
            return acc;
          }, { priority: Infinity, count: 0 });

          // console.log("biggest ->", {biggest, biggest_});

          let selectedUser: any = ""
          if (biggest_?.username ? biggest_?.count <= 0 : biggest?.count <= 0) {


            availEmployees.forEach((user) => {
              const roundNumber = Math.floor(Math.abs(user.count) / user.allotCount) + 1;
              const vCount = user.allotCount - (Math.abs(user.count) % user.allotCount);

              // Add roundNumber and vCount to the user object
              user.roundNumber = roundNumber;
              user.vCount = vCount;
              // console.log({roundNumber, vCount, name: user?.username})
            });

            // console.log('availEmployees updated ->', availEmployees)
            // Filter availEmployees based on roundNumber
            const filteredEmployees = availEmployees.filter((user) => {
              return user.roundNumber === Math.min(...availEmployees.map((u) => u.roundNumber));
            });

            // Sort filteredEmployees based on priority (ascending order)
            filteredEmployees.sort(function (a, b) {
              return parseFloat(a?.priority) - parseFloat(b?.priority);
            });

            // Get the user with the lowest roundNumber and highest priority
            selectedUser = filteredEmployees[0];

          }

          // console.log("selectedUser ->", selectedUser);

          const availableRepId = await User.find(
            {
              locationId: selectedUser ? selectedUser?.locationId : biggest_?.locationId || biggest.locationId,
              calId: selectedUser ? selectedUser?.calId : biggest_?.calId || biggest?.calId,
              email: selectedUser ? selectedUser?.email : biggest_?.email || biggest?.email,
            },
            { new: true }
          );

          await User.findOneAndUpdate(
            { _id: availableRepId[0]?._id },
            { count: selectedUser ? selectedUser?.count - 1 : biggest_?.count === undefined ? biggest?.count - 1 : biggest_?.count - 1 }
          );

          

          await this.insertCalenderEvent(
            selectedUser ? selectedUser?.calId : biggest_?.calId || biggest?.calId,
            selectedUser ? selectedUser?.email : biggest_?.email || biggest?.email,
            cxName,
            address,
            notes,
            time.toISOString(),
            endTime.toISOString()
          );

          let allUsers = await User.find({
            hasCalId: true,
            available: true,
            locationId: user?.locationId,
            roleId: { $ne: "6425796a73e386a02cb01199" },
          });

          let query = await User.find({
            hasCalId: true,
            available: true,
            count: { $lte: 0 },
            locationId: user?.locationId,
            roleId: { $ne: "6425796a73e386a02cb01199" },
          });

          if (allUsers.length === query.length) {
            
            let promise = [];

            allUsers.forEach((user) => {
              let resetValue =
                user.count + user.allotCount > user.allotCount
                  ? user.allotCount
                  : user.count + user.allotCount;

              let update = User.findOneAndUpdate(
                { _id: user._id },
                { count: resetValue, isNew: false }
              );
              promise.push(update);
            });

            await Promise.all(promise);
          }

          resolve(availableRepId[0]?._id);
        } else {
          resolve(user._id);
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  // inserting into the calender using the calId using this helper
  public async insertCalenderEvent(
    calId,
    email,
    cxName,
    address,
    notes,
    start,
    end
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        const calendar = google.calendar({
          version: "v3",
          auth: await OAuthService.getOAuthClient(),
        });
        let event: any = {
          summary: "Sales Appointment with " + cxName,
          description: address + "\n" + notes,
          start: {
            dateTime: new Date(start).toISOString(),
          },
          end: {
            dateTime: new Date(end).toISOString(),
          },
          reminders: {
            useDefault: false,
          },
          attendees: {
            email: email,
          },
        };
        calendar.events.insert(
          { calendarId: calId, requestBody: event },
          (err, _) => {
            if (err) return reject(err);
            resolve(true);
          }
        );
      } catch (err) {
        return reject(err);
      }
    });
  }

  // filterting the user here, just returning the specified keys, we should remove this into the user file ( FUTURE )
  public async getFilteredUser(id) {
    return new Promise(async (resolve, reject) => {
      try {
        let [find] = await User.find({ _id: id });
        resolve({
          email: find.email,
          id: find._id,
          name: find.username,
        });
      } catch (err) {
        return reject(err);
      }
    });
  }

  // getting the user by id
  public async getSetterById(id) {
    return new Promise(async (resolve, reject) => {
      try {
        let [find] = await User.find({ _id: id });
        resolve(find);
      } catch (err) {
        return reject(err);
      }
    });
  }

  // sending proposal to the user here
  public async sendProposal(lead) {
    return new Promise(async (resolve, reject) => {
      try {
        let [location] = await Location.find({ _id: lead?.locationId });
        lead.state = location.state;
        let userEmail = lead?.email;
        if (typeof lead?.rep == "object") {
          lead.rep = lead?.rep.email || lead?.email;
          userEmail = lead?.rep;
        }
        let data: any = {
          company_id: parseInt(lead?.company_id),
          user_email: userEmail,
          email: lead?.email,
          first_name: lead?.firstName,
          last_name: lead?.lastName,
          state: lead?.state === "PK" ? "FL" : lead?.state,
          city: lead?.city,
          zip: lead?.zip,
          address:
            lead?.street +
            " " +
            lead?.city +
            ", " +
            lead?.state +
            " " +
            lead?.zip,
          phone: lead?.phone,
          utility_id: parseFloat(lead?.utility_id) || 0,
          utility_company: lead?.utility_name || "company",
          notes: `Lead Generated via Systems for ${lead?.firstName} ${lead?.lastName} - ${lead?._id}`,
          lat: parseFloat(lead?.lat),
          lon: parseFloat(lead?.lng),
          usage_bill_url: this.getLeadUtilPicture(lead?.utilPic),
        };
        let usageDetails = false;
        if (lead?.averageMonthlyBill && !usageDetails) {
          data.average_monthly_cost = lead.averageMonthlyBill;
          usageDetails = true;
        }
        if (lead?.annualBill && !usageDetails) {
          data.annual_usage = lead.annualBill;
          usageDetails = true;
        }
        if (lead?.monthlyBill && !usageDetails) {
          data.monthly_usage = lead.monthlyBill;
          usageDetails = true;
        }
        if (!usageDetails) {
          data.annual_usage = 0;
        }
        this.getPhxSoloCustomers(data, lead)
          .then((res: any) => {
            console.log("Proposal Response => ", res);
            return resolve(res);
          })
          .catch((err) => {
            return reject(err);
          });
      } catch (err) {
        return reject(err);
      }
    });
  }

  // creating the notification here
  public async sendNotification(payload, user) {
    return new Promise(async (resolve, reject) => {
      try {
        NotificationHelperService.createNotification(payload, user)
          .then((res) => {
            return resolve(res);
          })
          .catch((err) => {
            return reject(err);
          });
      } catch (err) {
        return reject(err);
      }
    });
  }

  // get all the companies data here via solo
  public async getCompanies(location) {
    return new Promise(async (resolve, reject) => {
      try {
        let url = `https://phx.gosolo.io/api/v3/utility_company?attributes=id%2Cname%2Cshort_name%2Cstate&state=${location.state}&limit=1000`;
        fetch(url, {
          headers: {
            Accept: "application/json",
            apikey:
              "c005de95871e5474b87656baa753417b:$2a$10$wFJTc3AS5oa39i.oeLdu3edVwwbfRbdbusDnGl3tN9dQ7ia2ktLLu",
          },
        })
          .then((response) => response.json())
          .then((res) => {
            return resolve(res);
          })
          .catch((err) => {
            return reject(err);
          });
      } catch (err) {
        return reject(err);
      }
    });
  }

  // email handler for leads
  public async sendEmailLeadCreation(lead) {
    return new Promise(async (resolve, reject) => {
      try {
        const userRep: any = await this.getFilteredUser(lead?.rep);
        if (userRep?.email === lead?.setter?.email) {
          MailService.sendLeadCreationEmail(lead, lead?.setter, false)
            .then((res) => {
              return resolve(lead);
            })
            .catch((err) => {
              return reject(err);
            });
        } else {
          MailService.sendLeadCreationEmail(lead, userRep, true)
            .then((res) => {
              MailService.sendLeadCreationEmail(lead, lead?.setter, false)
                .then((res) => {
                  return resolve(lead);
                })
                .catch((err) => {
                  return reject(err);
                });
            })
            .catch((err) => {
              return reject(err);
            });
        }
      } catch (err) {
        return reject(err);
      }
    });
  }

  // returing all the list of time slots
  public async getAppointmentDates(user, date) {
    return new Promise(async (resolve, reject) => {
      try {
        const startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 6, 0, 0);
        const endTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 0, 0);
        this.isSetter(user.roleId)
          .then((res) => {
            if (res) {
           
              this.getClosers(user.locationId)
                .then((closers: any) => {
                  
                  let allEvents = [];
                  closers.forEach((closer) => {
                    let event:any = this.getEventSetter(
                      closer.calId,
                      startTime.toISOString(),
                      endTime.toISOString()
                    );
                  
                    
                    allEvents.push(event)
                  });
                  Promise.all(allEvents)
                    .then((events) => {
                      
                      const eventsArray = events.map((currVal)=> currVal.events).flat()
                      const slotsArray = events.map((currVal)=> currVal.slots).flat()        
                      const uniqueArray = [...new Set(slotsArray)];
                      // Sort the array based on time
                      uniqueArray.sort((a, b) => {
                        const timeA: any = new Date('1970/01/01 ' + a);
                        const timeB: any = new Date('1970/01/01 ' + b);
                        return timeA - timeB;
                      });
                      function hasThreeSlotsInLine(timeSlot, slots) {
                        const index = slots.indexOf(timeSlot);

                        if (index > -1 && index <= slots.length - 3) {
                          const slot1 = slots[index];
                          const slot2 = slots[index + 1];
                          const slot3 = slots[index + 2];

                          const slot1Time = moment(slot1, 'hh:mm A');
                          const slot2Time = moment(slot2, 'hh:mm A');
                          const slot3Time = moment(slot3, 'hh:mm A');

                          const diff1 = slot2Time.diff(slot1Time, 'minutes');
                          const diff2 = slot3Time.diff(slot2Time, 'minutes');

                          if (diff1 === 30 && diff2 === 30) {
                            return true; // Three slots in line found
                          }
                        }

                        return false; // No three slots in line
                      }
                      const filteredTime = uniqueArray.filter((timeSlot) => hasThreeSlotsInLine(timeSlot, uniqueArray));
                      const returnedResponse = {
                        availableTimeSlots: filteredTime,
                        bookedEvents: eventsArray
                      }
                      return resolve(returnedResponse);
                    })
                    .catch((err) => {
                      return reject(err);
                    });
                })
                .catch((err) => {
                  return reject(err);
                });
            } else {
              this.getEventNotSetter(
                user.calId,
                startTime.toISOString(),
                endTime.toISOString()
              )
                .then((events: any) => {
                  return resolve(events);
                })
                .catch((err) => {
                  return reject(err);
                });
            }
          })
          .catch((err) => {
            return reject(err);
          });
      } catch (err) {
        return reject(err);
      }
    });
  }

  // Class inclusive function


  // getting all the not setter events of a user

  private async getEventSetter(calId, start, end, maxResults = undefined) {
    return new Promise(async (resolve, reject) => {
      try {
        const calendar = google.calendar({
          version: "v3",
          auth: await OAuthService.getOAuthClient(),
        });
        const timezone = 'Canada/Eastern'; // Replace with your desired timezone

        const date = new Date();
        const startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 6, 0, 0);
        const endTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 24, 0, 0);
        const response = await calendar.events.list({
          calendarId: calId, // Use 'primary' for the user's primary calendar
          timeZone: timezone,
          timeMin: start,
          timeMax: end,
          singleEvents: true,
          orderBy: 'startTime',
        });

        const events = response.data.items;
        // Generate an array of all time slots
        const timeSlots = [];
        const slotStartTime = new Date(startTime);
        while (slotStartTime <= endTime) {
          timeSlots.push(slotStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          slotStartTime.setTime(slotStartTime.getTime() + 30 * 60 * 1000); // Increment by 30 minutes
        }
        const conflictingEvents = [];
        events.map((v) => {
          const dateTimeString = moment(v.start.dateTime).tz(timezone);
          const dateTimeEnd = moment(v.end.dateTime).tz(timezone);
          const format = 'hh:mm A';
          const startsTime = moment(dateTimeString).tz(timezone).format(format);
          const endsTime = moment(dateTimeEnd).tz(timezone).subtract(1, 'minutes');
          const endsTimeMinus = endsTime.tz(timezone).format(format);
          conflictingEvents.push({ start: startsTime, end: endsTimeMinus })
        })
        function hasConflict(timeSlot, events) {
          const time = moment(timeSlot, 'hh:mm A').tz(timezone);
          for (const event of events) {
            
            const start = moment(event.start, 'hh:mm A').tz(timezone);
            const end = moment(event.end, 'hh:mm A').tz(timezone);
            
            if (time.isBetween(start, end, null, '[]')) {
              return true; // Conflict found
            }
          }
          return false; // No conflict
        }
        const filteredTimeSlots = timeSlots.filter((timeSlot) => {
          const duration = moment.duration('1.5 hours');
          // const duration = moment.duration('30 minutes');
          const endTime = moment(timeSlot, 'hh:mm A').tz(timezone).add(duration);
          
          
          return !hasConflict(timeSlot, conflictingEvents);
        });

        return resolve({slots:filteredTimeSlots,events})
      } catch (err) {
        return reject(err);
      }
    });
  }
  private async getEventNotSetter(calId, start, end, maxResults = undefined) {
    return new Promise(async (resolve, reject) => {
      try {
        const calendar = google.calendar({
          version: "v3",
          auth: await OAuthService.getOAuthClient(),
        });
        const timezone = 'Canada/Eastern'; // Replace with your desired timezone
       // const timezone = 'Karachi/Pakistan'; // Replace with your desired timezone

        const date = new Date();
        const startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 6, 0, 0);
        const endTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 24, 0, 0);
        const response = await calendar.events.list({
          calendarId: calId, // Use 'primary' for the user's primary calendar
          timeZone: timezone,
          timeMin: start,
          timeMax: end,
          singleEvents: true,
          orderBy: 'startTime',
        });
        

        const events = response.data.items;
        // const userEvents = events.filter(event => event.creator.email === 'anas.khan@excel-pros.com');
        const format = 'hh:mm A';

        // Generate an array of all time slots
        const timeSlots = [];
        const slotStartTime = new Date(startTime);
        while (slotStartTime <= endTime) {
          timeSlots.push(slotStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          slotStartTime.setTime(slotStartTime.getTime() + 30 * 60 * 1000); // Increment by 30 minutes
        }
        const conflictingEvents = [];

        // const convertedTime = moment(dateTimeString).format(format);
        events.map((v) => {
          const dateTimeString = moment(v.start.dateTime).tz(timezone);
          const dateTimeEnd = moment(v.end.dateTime).tz(timezone);
          const format = 'hh:mm A';
          const startsTime = moment(dateTimeString).tz(timezone).format(format);
          const endsTime = moment(dateTimeEnd).tz(timezone).subtract(1, 'minutes');
          const endsTimeMinus = endsTime.tz(timezone).format(format);
          conflictingEvents.push({ start: startsTime, end: endsTimeMinus })
        })
        
        function hasConflict(timeSlot, events) {
          const time = moment(timeSlot, 'hh:mm A').tz(timezone);
          for (const event of events) {
            
            const start = moment(event.start, 'hh:mm A').tz(timezone);
            const end = moment(event.end, 'hh:mm A').tz(timezone);
            
            if (time.isBetween(start, end, null, '[]')) {
              return true; // Conflict found
            }
          }
          return false; // No conflict
        }
        // const filteredTimeSlots = timeSlots.filter((timeSlot) => !hasConflict(timeSlot, conflictingEvents));
        const filteredTimeSlots = timeSlots.filter((timeSlot) => {
          const duration = moment.duration('1.5 hours');
          // const duration = moment.duration('30 minutes');
          const endTime = moment(timeSlot, 'hh:mm A').tz(timezone).add(duration);
        
          return !hasConflict(timeSlot, conflictingEvents);
        });

        

        function hasThreeSlotsInLine(timeSlot, slots) {
          const index = slots.indexOf(timeSlot);

          if (index > -1 && index <= slots.length - 3) {
            const slot1 = slots[index];
            const slot2 = slots[index + 1];
            const slot3 = slots[index + 2];

            const slot1Time = moment(slot1, 'hh:mm A');
            const slot2Time = moment(slot2, 'hh:mm A');
            const slot3Time = moment(slot3, 'hh:mm A');

            const diff1 = slot2Time.diff(slot1Time, 'minutes');
            const diff2 = slot3Time.diff(slot2Time, 'minutes');

            if (diff1 === 30 && diff2 === 30) {
              return true; // Three slots in line found
            }
          }

          return false; // No three slots in line
        }
        const filteredTime = filteredTimeSlots.filter((timeSlot) => hasThreeSlotsInLine(timeSlot, filteredTimeSlots));
        const returnedResponse = {
          availableTimeSlots: filteredTime,
          bookedEvents: events
        }
        return resolve(returnedResponse);
      } catch (err) {
        return reject(err);
      }
    });
  }
  // getting all the events of a user

  private async getEvents(calId, start, end, maxResults = undefined) {
    return new Promise(async (resolve, reject) => {
      try {
        const calendar = google.calendar({
          version: "v3",
          auth: await OAuthService.getOAuthClient(),
        });
        let payload = {
          calendarId: calId,
          timeMin: start,
          timeMax: end,
          singleEvents: true,
          orderBy: "startTime",
          maxResults: 10,
        };
        if (maxResults) {
          payload.maxResults = maxResults;
        }
        calendar.events
          .list(payload)
          .then((events) => {
            return resolve(events);
          })
          .catch((err) => {
            return reject(err);
          });
      } catch (err) {
        return reject(err);
      }
    });
  }
  // filter the busy slots, and return the time list
  private filterBusySlotsFromList(list, events) {
    let blockList = [];
    events.forEach((event) => {
      let startTime = new Date(event.start.dateTime);
      let endTime = new Date(event.end.dateTime);
      for (let i = list.length - 1; i >= 0; i--) {
        let regex = /^(\d{1,2}):(\d{2})\s([APM]{2})$/;
        let time = list[i];
        const match = time.match(regex);
        let slotHours = parseInt(match[1]);
        if (match[3] === "PM") {
          slotHours = slotHours + 12;
        }
        let slotMinutes = parseInt(match[2]);
        let slotTime = new Date(
          startTime.getFullYear(),
          startTime.getMonth(),
          startTime.getDate(),
          slotHours,
          slotMinutes
        );
        if (slotTime >= startTime && slotTime < endTime) {
          blockList.push(time);
          blockList.push(list[i - 1]);
          blockList.push(list[i - 2]);
        }
      }
    });
    return blockList;
  }

  private filterSlotsBlockList(apptList, blockList) {
    let blockSlots = [];
    apptList.forEach((time) => {
      let check = 1;
      blockList.forEach((blocks) => {
        if (blocks.includes(time)) {
          check = check * 1;
        } else {
          check = check * 0;
        }
      });
      if (check === 1) {
        blockSlots.push(time);
      }
    });
    return blockSlots;
  }

  // removing the time from the list
  private removeFromList(apptList, blockList) {
    for (let i = apptList.length - 1; i >= 0; i--) {
      const currentItem = apptList[i];
      if (blockList.includes(currentItem)) {
        apptList.splice(i, 1);
      }
    }
  }

  // getting the solo customers here
  private getPhxSoloCustomers(data, lead) {
    return new Promise(async (resolve, reject) => {
      try {
        fetch("https://phx.gosolo.io/api/v3/customers", {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            apikey:
              "c005de95871e5474b87656baa753417b:$2a$10$wFJTc3AS5oa39i.oeLdu3edVwwbfRbdbusDnGl3tN9dQ7ia2ktLLu",
          },
        })
          .then((res) => res.json())
          .then((resp: any) => {
           
            if (lead?._id != undefined) {
              Leads.findOneAndUpdate(
                { _id: lead?._id },
                {
                  path: resp?.path,
                }
              )
                .then(() => {
                  return resolve(resp);
                })
                .catch((err) => {
                  return reject(err);
                });
            }
          })
          .catch((err) => {
            return reject(err);
          });
      } catch (err) {
        return reject(err);
      }
    });
  }

  // google drive picture stuff
  private getLeadUtilPicture(viewLink) {
    if (!viewLink && viewLink !== "null") {
      let editString = viewLink.replace(
        "https://drive.google.com/file/d/",
        "https://drive.google.com/uc?export=download&id="
      );
      if (editString == viewLink) {
        editString = viewLink.replace(
          "https://drive.google.com/open?id=",
          "https://drive.google.com/uc?export=download&id="
        );
      }
      let splitT = editString.slice(-18);
      if (splitT == "/view?usp=drivesdk") {
        return editString.slice(0, -18);
      } else {
        return editString;
      }
    } else {
      return [];
    }
  }

  // getting all the user ( non setters )
  private async getClosers(id) {
    return new Promise(async (resolve, reject) => {
      try {
        let users: any = await User.find({
          roleId: { $ne: "6425796a73e386a02cb01199" },
          hasCalId: true,
          locationId: id,
          available: true,
          active: true,
        });
        resolve(users);
      } catch (err) {
        return reject(err);
      }
    });
  }

  // fetching the calId of the user, not using this ( remove )
  private async getCalId(id) {
    return new Promise(async (resolve, reject) => {
      try {
        let [location] = await Location.find({ _id: id });
        resolve(location.calId);
      } catch (err) {
        return reject(err);
      }
    });
  }

  // getting the time list ( 6am - 11pm )
  private getApptTimeList(startTime, endTime) {
    const timeArray = [];
    let currentTime = startTime;
    while (currentTime <= endTime) {
      const hours = currentTime.getHours().toString().padStart(2, "0");
      const minutes = currentTime.getMinutes().toString().padStart(2, "0");
      const time =
        hours >= 12
          ? hours - 12 + ":" + minutes + " " + "PM"
          : hours + ":" + minutes + " " + "AM";

      timeArray.push(time);

      currentTime = new Date(currentTime.getTime() + 30 * 60000);
    }
    return timeArray;
  }

  // check for setter users
  private async isSetter(id) {
    return new Promise(async (resolve, reject) => {
      try {
        let [role] = await Roles.find({ _id: id });
        
        resolve(role?.role.toLowerCase() === "setter" ? true : false);
      } catch (err) {
        return reject(err);
      }
    });
  }
}

export default new LeadsHelperService();
