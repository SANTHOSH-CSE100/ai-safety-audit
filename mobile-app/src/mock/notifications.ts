import type { NotificationResponse } from "../types/api";
import { daysAgo, hoursAgo } from "./dates";

function notification(
  id: string,
  title: string,
  body: string,
  read: boolean,
  createdAt: string,
  relatedReportId: string | null = null
): NotificationResponse {
  return { id, title, body, read, relatedReportId, createdAt };
}

/** Spans critical / warning / info tone and read / unread, matching every notification-row visual state. */
export const mockNotifications: NotificationResponse[] = [
  notification(
    "mock-notif-1",
    "Critical violation detected",
    "Forklift proximity violation flagged near Bay 3 at Vizag Steel Fabrication Yard.",
    false,
    hoursAgo(2),
    "mock-report-vizag-1"
  ),
  notification(
    "mock-notif-2",
    "Safety report ready",
    "Your safety audit for Chennai Manufacturing Unit has finished processing.",
    false,
    hoursAgo(5),
    "mock-report-chennai-2"
  ),
  notification(
    "mock-notif-3",
    "Upload failed",
    "\"packaging-floor-walkthrough.mp4\" couldn't be processed. Please re-upload.",
    false,
    daysAgo(1)
  ),
  notification(
    "mock-notif-4",
    "Weekly safety summary",
    "Pune Assembly Plant averaged a 88 safety score this week, up 4 points from last week.",
    true,
    daysAgo(2)
  ),
  notification(
    "mock-notif-5",
    "New factory added",
    "Vizag Steel Fabrication Yard was added to your account.",
    true,
    daysAgo(9)
  ),
  notification(
    "mock-notif-6",
    "Safety report ready",
    "Your safety audit for Pune Assembly Plant has finished processing.",
    true,
    daysAgo(9),
    "mock-report-pune-2"
  ),
];
