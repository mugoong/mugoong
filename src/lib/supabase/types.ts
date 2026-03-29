export type Database = {
  public: {
    Tables: {
      listings: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          slug: string;
          category: string;
          subcategory: string;
          city: string;
          title: string;
          description: string;
          content: string;
          image_url: string;
          gallery: string[];
          price: number;
          currency: string;
          rating: number;
          review_count: number;
          tags: string[];
          featured: boolean;
          published: boolean;
          menu_items: MenuItemJson[];
          address: string;
          phone: string;
          operating_hours: string;
          notes: string;
          author_id: string;
        };
        Insert: Omit<Database['public']['Tables']['listings']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['listings']['Insert']>;
      };
      bookings: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          listing_id: string;
          listing_title: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          booking_date: string;
          booking_time: string;
          guests: number;
          total_price: number;
          currency: string;
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
          notes: string;
          admin_notes: string;
        };
        Insert: Omit<Database['public']['Tables']['bookings']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['bookings']['Insert']>;
      };
      admin_users: {
        Row: {
          id: string;
          created_at: string;
          email: string;
          name: string;
          role: 'admin' | 'editor';
        };
        Insert: Omit<Database['public']['Tables']['admin_users']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['admin_users']['Insert']>;
      };
    };
  };
};

export type MenuItemJson = {
  name: string;
  price: number;
  description?: string;
};

export type ListingRow = Database['public']['Tables']['listings']['Row'];
export type BookingRow = Database['public']['Tables']['bookings']['Row'];
export type AdminUserRow = Database['public']['Tables']['admin_users']['Row'];
