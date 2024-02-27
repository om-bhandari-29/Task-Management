export interface getMessageResI{
  id: number;
  message: string;
  name: string;
  userType: string;
  senderId: number;
  isSeen: boolean;
  messageDate: string;
}

export interface getMessageI{
  isPagination: boolean;
  index: number;
  take: number;
  search: string;
}