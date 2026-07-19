export interface Event {
  id:               string;
  title:            string;
  slug:             string;
  description:      string;
  event_type:       string;
  status:           string;
  is_online:        boolean;
  is_free:          boolean;
  price_usd:        number | null;
  max_attendees:    number | null;
  scheduled_at:     string;
  duration_minutes: number;
  timezone:         string;
  zoom_join_url:    string | null;
  thumbnail_url:    string | null;
  tags:             string[] | null;
}