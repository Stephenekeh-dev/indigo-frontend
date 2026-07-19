export interface Post {
  id:              string;
  title:           string;
  slug:            string;
  excerpt:         string | null;
  content:         string;
  status:          string;
  category:        string;
  cover_image_url: string | null;
  tags:            string[] | null;
  read_time_mins:  number | null;
  view_count:      number;
  likes_count:     number;
  published_at:    string | null;
  created_at:      string;
}