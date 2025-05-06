export interface userSliceState {
  userDetail: {
    username: string;
    email: string;
    profilePic?: string;
    createdAt?: string;
    _id: string;
    updatedAt?: string;
  };
  token: string;
}

export interface themeSliceState {
  theme: "dark" | "light";
}
