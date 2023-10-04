import MailService from "./mail.service";

export class LeadsHelperService {

  public async sendEmailLeadCreation(lead) {
    return new Promise(async (resolve, reject) => {
      try {
        const request = {
          template: "./templates/MailTemplate/leadCreatedInfo.ejs",
          subject: `This email response will be sent to lead name ${lead.name} with email address ${lead.email}.`,
          email: "info@excel-pros.com",
          data: lead
        }
        MailService.sendLeadCreationEmail(request, true)
          .then((res) => {
            const requestLead = {
              template: "./templates/MailTemplate/leadCreated.ejs",
              subject: "Your request has been successfully received by Excel Pros.",
              email: lead.email,
              data: lead
            }
            MailService.sendLeadCreationEmail(requestLead, false)
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
