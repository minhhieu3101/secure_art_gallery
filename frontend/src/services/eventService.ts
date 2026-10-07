import axiosClient from "./axiosClient";

export interface Room {
    id: string;
    number: number;
    people: number;
    occupancy: number;
    status: string
  }
  
  export const getOpenedRooms = async (): Promise<Room[]> => {
    const response = await axiosClient.get("/dashboard/opened_room");
  
    return response.data;
  };

export const enterGallery = async (email: string) => {
  const response = await axiosClient.post("/events/gallery/enter", {
    email,
  });

  return response.data;
};

export const leaveGallery = async (email: string) => {
  const response = await axiosClient.post(
    "/events/gallery/leave",
    {
      email,
    }
  );

  return response.data;
};

export const enterRoom = async (
  email: string,
  room_number: number
) => {
  const response = await axiosClient.post(
    "/events/room/enter",
    {
      email,
      room_number,
    }
  );

  return response.data;
};

export const leaveRoom = async (
  email: string,
  room_number: number
) => {
  const response = await axiosClient.post(
    "/events/room/leave",
    {
      email,
      room_number,
    }
  );

  return response.data;
};