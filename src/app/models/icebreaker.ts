
export interface IcebreakerI {
  id?: string;
  text?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface IcebreakerAnswerI {
  id?: string;
  userId: string;
  icebreakerId: string;
  text?: string;
  createdAt?: any;
  updatedAt?: any;
}




