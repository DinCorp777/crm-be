import MailService from "./mail.service";

export class LeadsHelperService {

  public async sendEmailLeadCreation(lead) {
    return new Promise(async (resolve, reject) => {
      try {
        const request = {
          subject: `This email response will be sent to lead name ${lead.name} with email address ${lead.email}.`,
          email: "info@excel-pros.com",
          name: lead.name
        }
        MailService.sendLeadCreationEmail(request)
          .then((res) => {
            const requestLead = {
              subject: "Your request has been Successdully Recevied to Excel Pros.",
              email: lead.email,
              name: lead.name
            }
            MailService.sendLeadCreationEmail(requestLead)
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
      } catch (err) {
        return reject(err);
      }
    });
  }

}
export default new LeadsHelperService();
