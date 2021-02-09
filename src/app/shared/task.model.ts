import { ISODateString } from "@capacitor/core";
import { Urgency } from "./urgency.enum";

export class Task {
  public id?: number;
  public title: string;
  public description: string;
  public startDate: ISODateString;
  public endDate: ISODateString;
  public status: number;
  public urgency: Urgency;
  public reminder?: null | ISODateString | undefined;

  /**
   *
   * @param title A title for the task.
   * @param description A description for the task.
   * @param startDate Starting date for the task.
   * @param endDate Endind date for the task.
   * @param status Status of the task (Finished/Unfinished => true/false).
   * @param urgency How urgent is the task.
   * @param reminder A reminder for the task.
   * @param id The identifier of the task.
   */
  constructor(
    title: string,
    description: string,
    startDate: ISODateString,
    endDate: ISODateString,
    status: number,
    urgency: Urgency,
    reminder?: null | ISODateString | undefined,
    id?: number
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.startDate = startDate;
    this.endDate = endDate;
    this.status = status;
    this.urgency = urgency;
    this.reminder = reminder;
  }
}
