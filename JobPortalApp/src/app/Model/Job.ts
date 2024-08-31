export interface Job {
    id: number,
    rrid: string,
    jobDescription: string,
    noOfPositions:number,
    externalPositions:number,
    selectedPositions:number,
    status:string,
    appliedStatus:string,
    userId:number
  }