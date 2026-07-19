export interface ServiceListing {
  id:             string;
  title:          string;
  slug:           string;
  description:    string;
  short_desc:     string | null;
  service_type:   string;
  price_usd:      number;
  duration_hours: number | null;
  is_active:      boolean;
  created_at:     string;
}

export interface Booking {
  id:               string;
  service_id:       string;
  client_id:        string;
  scheduled_at:     string;
  duration_minutes: number;
  status:           string;
  zoom_join_url:    string | null;
  client_notes:     string | null;
  created_at:       string;
}

export interface CreateBookingDto {
  service_id:   string;
  scheduled_at: string;
  client_notes?: string;
}