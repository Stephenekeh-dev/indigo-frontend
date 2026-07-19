export interface Course {
  id:                  string;
  title:               string;
  slug:                string;
  description:         string;
  short_desc:          string | null;
  level:               'beginner' | 'intermediate' | 'advanced';
  status:              string;
  price_usd:           number;
  thumbnail_url:       string | null;
  total_duration_mins: number;
  total_lessons:       number;
  is_free:             boolean;
  tags:                string[] | null;
  published_at:        string | null;
}

export interface Enrollment {
  id:              string;
  course_id:       string;
  status:          string;
  progress_pct:    number;
  enrolled_at:     string;
  completed_at:    string | null;
}