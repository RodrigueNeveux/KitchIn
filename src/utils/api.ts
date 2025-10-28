import { projectId, publicAnonKey } from './supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/server`;

console.log('API Base URL configured as:', API_BASE_URL);

export class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }

  async testConnection() {
    try {
      const response = await fetch(`${API_BASE_URL}/make-server-e298da7a/health`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      const data = await response.json();
      console.log('Health check response:', data);
      return data;
    } catch (error) {
      console.error('Health check failed:', error);
      console.error('Attempted URL:', `${API_BASE_URL}/make-server-e298da7a/health`);
      throw error;
    }
  }

  private async request(endpoint: string, options: RequestInit = {}, retries = 2) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      headers['Authorization'] = `Bearer ${publicAnonKey}`;
    }

    let lastError: any;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const fullUrl = `${API_BASE_URL}${endpoint}`;
        console.log(`Requesting: ${fullUrl}`);
        
        const response = await fetch(fullUrl, {
          ...options,
          headers,
        });

        const data = await response.json();

        if (!response.ok) {
          console.error(`API error on ${endpoint}:`, data.error);
          throw new Error(data.error || 'API request failed');
        }

        return data;
      } catch (error) {
        lastError = error;
        if (attempt < retries) {
          console.log(`Retrying ${endpoint} (attempt ${attempt + 1}/${retries})...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        }
      }
    }
    
    console.error(`Network error on ${endpoint} after ${retries + 1} attempts:`, lastError);
    console.error(`Full URL was: ${API_BASE_URL}${endpoint}`);
    throw lastError;
  }

  // Auth
  async signup(email: string, password: string, name: string) {
    return this.request('/make-server-e298da7a/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  async getProfile() {
    return this.request('/make-server-e298da7a/profile');
  }

  // Household
  async createInvite() {
    return this.request('/make-server-e298da7a/household/invite', {
      method: 'POST',
    });
  }

  async joinHousehold(inviteCode: string) {
    return this.request('/make-server-e298da7a/household/join', {
      method: 'POST',
      body: JSON.stringify({ inviteCode }),
    });
  }

  async updateHousehold(name: string) {
    return this.request('/make-server-e298da7a/household', {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
  }

  async updateUserName(name: string) {
    return this.request('/make-server-e298da7a/profile', {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
  }

  async removeMember(memberId: string) {
    return this.request(`/make-server-e298da7a/household/member/${memberId}`, {
      method: 'DELETE',
    });
  }

  // Products
  async getProducts() {
    return this.request('/make-server-e298da7a/products');
  }

  async addProduct(product: any) {
    return this.request('/make-server-e298da7a/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  async updateProduct(id: string, updates: any) {
    return this.request(`/make-server-e298da7a/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteProduct(id: string) {
    return this.request(`/make-server-e298da7a/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Shopping Lists
  async getShoppingLists() {
    return this.request('/make-server-e298da7a/shopping-lists');
  }

  async addShoppingItem(item: any) {
    return this.request('/make-server-e298da7a/shopping-lists', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async updateShoppingItem(id: string, updates: any) {
    return this.request(`/make-server-e298da7a/shopping-lists/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteShoppingItem(id: string) {
    return this.request(`/make-server-e298da7a/shopping-lists/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();

// Open Food Facts API
export async function getProductByBarcode(barcode: string) {
  try {
    const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
    const data = await response.json();
    
    if (data.status === 1 && data.product) {
      const product = data.product;
      
      // Déterminer la catégorie basée sur les informations du produit
      let category: 'fridge' | 'pantry' | 'freezer' = 'pantry';
      
      const categories = product.categories_tags || [];
      const categoryText = categories.join(' ').toLowerCase();
      
      if (categoryText.includes('dairy') || categoryText.includes('lait') || 
          categoryText.includes('yaourt') || categoryText.includes('fromage') ||
          categoryText.includes('viande') || categoryText.includes('meat') ||
          categoryText.includes('poisson') || categoryText.includes('fish') ||
          categoryText.includes('légume') || categoryText.includes('vegetable') ||
          categoryText.includes('fruit')) {
        category = 'fridge';
      } else if (categoryText.includes('surgelé') || categoryText.includes('frozen') ||
                 categoryText.includes('glace') || categoryText.includes('ice-cream')) {
        category = 'freezer';
      }
      
      return {
        name: product.product_name || product.product_name_fr || 'Produit inconnu',
        brand: product.brands || '',
        category,
        image: product.image_url || product.image_front_url || undefined,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    return null;
  }
}
