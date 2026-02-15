// export interface InsightEvent {
//   id: string;
// }


export interface InsightEvent {
    id: string;
    title: string;
    description: string;
    createdAt: Date;
    createdBy: string;
    updatedAt?: Date;
    updatedBy?: string;
  }