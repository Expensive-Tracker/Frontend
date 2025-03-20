export interface userSliceState {
  userDetail: {
    username: string;
    email: string;
    password: string;
    profilePic?: string;
    createdAt?: string;
    _id: string;
    updatedAt?: string;
  };
}

export interface themeSliceState {
  theme: "dark" | "light";
}
