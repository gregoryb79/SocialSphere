import { apiClient } from "./apiClient";

export type Notification = {
  id: string;
  recipient_id: string;
  sender_id: string;
  type: "like" | "comment" | "follow";
  post_id?: string | null;
  seen: number;
  created_at: string;
};

export async function fetchNotifications(userId: string) {
  
  const res = await apiClient.get(`/api/notifications/${userId}`);

  // if (!res.ok) {
  //   throw new Error("Failed to fetch notifications");
  // }

  // const data = await res.json();
  return res.data;
}

// export type Notification = {
//     _id: string;
//     recipient: string;
//     type: "follow" | "like" | "comment";
//     userId: string;
//     postId?: string;
//     seen: boolean;
//     createdAt: string;    
// };

// export async function fetchNotifications(userId: string): Promise<Notification[]> {
//     // Simulate fetching notifications from the server
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             resolve(mockNotifications);
//         }, 1000);
//     });
// }

// const mockNotifications: Notification[] = [
//   {
//     _id: "n1",
//     recipient: "user1",
//     type: "like",
//     userId: "user2",
//     postId: "post1",
//     seen: false,
//     createdAt: "2024-06-01T10:00:00Z",
//   },
//   {
//     _id: "n2",
//     recipient: "user1",
//     type: "comment",
//     userId: "user3",
//     postId: "post2",
//     seen: false,
//     createdAt: "2024-06-02T11:30:00Z",
//   },
//   {
//     _id: "n3",
//     recipient: "user1",
//     type: "follow",
//     userId: "user4",
//     seen: true,
//     createdAt: "2024-06-03T09:15:00Z",
//   },
//   {
//     _id: "n4",
//     recipient: "user1",
//     type: "like",
//     userId: "user5",
//     postId: "post3",
//     seen: true,
//     createdAt: "2024-06-04T14:45:00Z",
//   },
//   {
//     _id: "n5",
//     recipient: "user1",
//     type: "comment",
//     userId: "user2",
//     postId: "post1",
//     seen: false,
//     createdAt: "2024-06-05T08:20:00Z",
//   },
// ];
