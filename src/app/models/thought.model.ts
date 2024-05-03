export interface ThoughtModel {
  id: string;
  title: string;
  content: string;
  elevatorPitch: string
  tags: string[];
  status: '';
  dateCreated: Date;
  dateUpdated: Date;
  datePublished: Date;
  dateArchived: Date;
  dateDeleted: Date;
  children: ThoughtModel[];
}
