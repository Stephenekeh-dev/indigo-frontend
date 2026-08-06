export interface Product {
  id:            string;
  title:         string;
  slug:          string;
  description:   string;
  short_desc:    string | null;
  product_type:  string;
  status:        string;        // ← add this line
  price_usd:     number;
  compare_price: number | null;
  is_digital:    boolean;
  download_url:  string | null;
  thumbnail_url: string | null;
  tags:          string[] | null;
  stock_count:   number | null;
}

export interface CartItem {
  id:         string;
  product_id: string;
  quantity:   number;
  product?:   Product;
}

export interface Order {
  id:        string;
  status:    string;
  total_usd: number;
  created_at: string;
}