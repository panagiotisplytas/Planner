export class Reminder {
  public id: number;
  public title: string;
  public description: string;
  public date: string;

  /**
   *
   * @param title the title to be displayed.
   * @param description the description of the notifcation.
   * @param date the date to be scheduled at.
   * @param id task id is the same aw this id so the notification can be found.
   */
  constructor(title: string, description: string, date: string, id: number) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.date = date;
  }
}
