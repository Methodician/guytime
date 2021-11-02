
export interface TagI {
  id?: string;
  type: string;
  name: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface UserTagI {
  id?: string;
  userId: string;
  tagId: string;
  tag?: TagI;
  createdAt?: any;
  updatedAt?: any;
}



