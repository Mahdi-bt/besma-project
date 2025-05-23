
const API_URL = 'http://localhost:8000/api'

export interface Product {
  id: number
  nom_prod: string
  description_prod: string
  prix_prod: number
  qte_prod: number
  categorie_id: number
  features?: Record<string, string>
  images?: string[]
}

export async function getProducts(categoryId?: number): Promise<Product[]> {
  const url = categoryId 
    ? `${API_URL}/products/read.php?categorie_id=${categoryId}`
    : `${API_URL}/products/read.php`
  
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch products')
  }
  
  const data = await response.json()
  console.log(data)
  // Handle the nested products array in the response
  const products = data.products || []
  return products
}

export async function getProduct(id: number): Promise<Product> {
  const response = await fetch(`${API_URL}/products/read_one.php?id=${id}`)
  if (!response.ok) {
    throw new Error('Failed to fetch product')
  }
  const data = await response.json()
  return data
}

export async function createProduct(product: Omit<Product, 'id' | 'images'>): Promise<Product> {
  const token = localStorage.getItem('jwt_token');
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_URL}/products/create.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(product),
  });

  if (response.status === 401) {
    throw new Error('Session expired. Please login again.');
  }

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Create product error:', errorText);
    throw new Error(`Failed to create product: ${errorText}`);
  }

  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('Server returned non-JSON response');
  }

  const data = await response.json();
  return {
    id: data.id,
    nom_prod: data.nom_prod,
    description_prod: data.description_prod,
    prix_prod: data.prix_prod,
    qte_prod: data.qte_prod,
    categorie_id: data.categorie_id,
    images: data.images || [],
    features: data.features || {}
  };
}

export async function updateProduct(id: number, product: Partial<Product>): Promise<Product> {
  const token = localStorage.getItem('jwt_token');
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_URL}/products/update.php`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ id_prod: id, ...product }),
  });
  
  if (response.status === 401) {
    throw new Error('Session expired. Please login again.');
  }

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Update product error:', errorText);
    throw new Error(`Failed to update product: ${errorText}`);
  }

  const data = await response.json();
  return {
    id: data.id,
    nom_prod: data.nom_prod,
    description_prod: data.description_prod,
    prix_prod: data.prix_prod,
    qte_prod: data.qte_prod,
    categorie_id: data.categorie_id,
    features: data.features || {},
    images: data.images || []
  };
}

export async function deleteProduct(id: number): Promise<boolean> {
  const token = localStorage.getItem('jwt_token');
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_URL}/products/delete.php?id=${id}`, {
    method: 'DELETE',
    headers: {
    'Authorization': `Bearer ${token}`
    },
    
  });
  
  if (response.status === 401) {
    throw new Error('Session expired. Please login again.');
  }

  if (!response.ok) {
    throw new Error('Failed to delete product');
  }
  return true;
}

export async function uploadProductImage(productId: number, imageFile: File | File[]): Promise<string[]> {
  if (!productId || !imageFile) {
    throw new Error('Product ID and valid image file(s) are required')
  }

  const formData = new FormData()
  formData.append('product_id', productId.toString())
  
  // Handle both single file and multiple files
  if (Array.isArray(imageFile)) {
    imageFile.forEach(file => {
      formData.append('images[]', file)
    })
  } else {
    formData.append('images[]', imageFile)
  }

  console.log(`Uploading image(s) for product ${productId}`)

  const response = await fetch(`${API_URL}/products/upload_image.php`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
    },
    body: formData
  })  

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Image upload error:', errorText)
    throw new Error(`Failed to upload image: ${errorText}`)
  }
  
  const data = await response.json()
  console.log('Image upload response:', data)
  
  if (data.errors && data.errors.length > 0) {
    console.error('Image upload errors:', data.errors)
    throw new Error(`Failed to upload image: ${data.errors.join(', ')}`)
  }
  
  // Return the array of uploaded filenames or empty array
  return data.uploaded || []
}

export async function getProductImages(productId: number): Promise<string[]> {
  const response = await fetch(`${API_URL}/products/images.php?id=${productId}`)
  if (!response.ok) {
    throw new Error('Failed to fetch product images')
  }
  const data = await response.json()
  return Array.isArray(data.images) ? data.images : []
}

export async function deleteProductImage(imageId: number): Promise<boolean> {
  const response = await fetch(`${API_URL}/products/delete_image.php?id=${imageId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
    }
  })
  if (!response.ok) {
    throw new Error('Failed to delete image')
  }
  return true
}

// Category API functions
export interface Category {
  id_categorie: number
  nom_categorie: string
}

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${API_URL}/categories/read.php`)
  if (!response.ok) {
    throw new Error('Failed to fetch categories')
  }
  const data = await response.json()
  return Array.isArray(data.categories) ? data.categories : []
}

export async function createCategory(category: Omit<Category, 'id_categorie'>): Promise<Category> {
    console.log(localStorage.getItem('jwt_token'))
  const response = await fetch(`${API_URL}/categories/create.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
    },
    body: JSON.stringify(category)
  })
  if (!response.ok) {
    throw new Error('Failed to create category')
  }
  const data = await response.json()
  return data
}

export async function updateCategory(id: number, category: Partial<Category>): Promise<Category> {
  const response = await fetch(`${API_URL}/categories/update.php`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
    },
    body: JSON.stringify({ id_categorie: id, ...category })
  })
  if (!response.ok) {
    throw new Error('Failed to update category')
  }
  const data = await response.json()
  return data
}

export async function deleteCategory(id: number): Promise<boolean> {
  const response = await fetch(`${API_URL}/categories/delete.php?id=${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
    }
  })
  if (!response.ok) {
    throw new Error('Failed to delete category')
  }
  return true
}

export interface DashboardStats {
  users: number
  products: number
  orders: number
  categories: number
  rendezVous: number
  messages: number
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const token = localStorage.getItem('jwt_token')
  const response = await fetch(`${API_URL}/stats.php`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard stats')
  }
  const data = await response.json()
  return {
    users: data.users,
    products: data.products,
    orders: data.orders,
    categories: data.categories,
    rendezVous: data.rendezVous,
    messages: data.messages
  }
}

export interface User {
  id: number
  nom: string
  email: string
  tel?: string
  role: 'admin' | 'user'
  createdAt?: string
  lastLogin?: string
}

export async function getUsers(): Promise<User[]> {
  const token = localStorage.getItem('jwt_token')
  const response = await fetch(`${API_URL}/users/read.php`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch users')
  }
  const data = await response.json()
  return data.success ? data.users : []
}

export interface RendezVous {
  id: number
  user_id: number
  user_name?: string
  user_email?: string
  date_rdv: string
  heure_rdv: string
  type_rdv: string
  description?: string
  status: 'en_attente' | 'confirme' | 'annule'
  created_at?: string
  updated_at?: string
}

export async function getRendezVous(): Promise<RendezVous[]> {
  const token = localStorage.getItem('jwt_token')
  const response = await fetch(`${API_URL}/rendez-vous/read.php`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  if (!response.ok) {
    throw new Error('Failed to fetch rendez-vous')
  }
  const data = await response.json()
  return data.records || []
}

export async function createRendezVous(rendezVous: {
  date_rdv: string
  heure_rdv: string
  type_rdv: string
  description?: string
}): Promise<{ message: string }> {
  const token = localStorage.getItem('jwt_token')
  const response = await fetch(`${API_URL}/rendez-vous/create.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(rendezVous)
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to create rendez-vous')
  }
  return response.json()
}

export async function updateRendezVousStatus(id: number, status: 'en_attente' | 'confirme' | 'annule'): Promise<{ message: string }> {
  const token = localStorage.getItem('jwt_token')
  const response = await fetch(`${API_URL}/rendez-vous/update_status.php`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ id, status })
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to update rendez-vous status')
  }
  return response.json()
}

// Order API functions
export interface Order {
  id_cmd: number
  date_cmd: string
  etat_cmd: string
  id_panier: number
  total: number
  qte: number
  shipping_nom?: string
  shipping_prenom?: string
  shipping_ville?: string
}

export interface OrderDetails {
  order: {
    id_cmd: number
    date_cmd: string
    etat_cmd: string
    total: number
    id_panier: number
    id_user: number
    user_nom: string
    user_email: string
    status_description: string
  }
  panier: {
    id_panier: number
    total: number
    prix: number
    qte: number
  }
  products: {
    id_prod: number
    nom_prod: string
    prix_prod: number
    stock_quantity: number
    cart_quantity: number
  }[]
  shipping: {
    nom: string
    prenom: string
    email: string
    telephone: string
    adresse: string
    ville: string
    code_postal: string
    pays: string
  }
  status_history: {
    status: string
    created_at: string
    description: string
  }[]
}

export async function placeOrder(orderData: {
  items: { product_id: number; quantity: number }[]
  shipping: {
    nom: string
    prenom: string
    email: string
    telephone: string
    adresse: string
    ville: string
    codePostal: string
    pays: string
  }
}): Promise<{ message: string; id_cmd: number; id_panier: number; total: number; qte: number }> {
  const token = localStorage.getItem('jwt_token')
  if (!token) {
    throw new Error('Authentication required')
  }

  // Get user ID from token
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (!user.id) {
    throw new Error('User not found')
  }

  // Transform data to match backend expectations
  const requestData = {
    products: orderData.items.map(item => ({
      id: item.product_id,
      quantity: item.quantity
    })),
    shipping: {
      nom: orderData.shipping.nom,
      prenom: orderData.shipping.prenom,
      email: orderData.shipping.email,
      telephone: orderData.shipping.telephone,
      adresse: orderData.shipping.adresse,
      ville: orderData.shipping.ville,
      codePostal: orderData.shipping.codePostal,
      pays: orderData.shipping.pays
    }
  }

  
  const response = await fetch(`${API_URL}/orders/place_order.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(requestData)
  })

  if (response.status === 401) {
    throw new Error('Session expired. Please login again.')
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || 'Failed to place order')
  }

  return response.json()
}

export async function getUserOrders(): Promise<Order[]> {
  const response = await fetch(`${API_URL}/orders/user_orders.php`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
    }
  })

  if (!response.ok) {
    throw new Error('Failed to fetch user orders')
  }

  const data = await response.json()
  return data.orders || []
}

export async function getOrderDetails(orderId: number): Promise<OrderDetails> {
  const response = await fetch(`${API_URL}/orders/order_details.php?id=${orderId}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
    }
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch order details' }))
    throw new Error(error.message)
  }

  const data = await response.json()
  return {
    order: {
      id_cmd: data.order.id_cmd,
      date_cmd: data.order.date_cmd,
      etat_cmd: data.order.etat_cmd,
      total: data.order.total,
      id_panier: data.order.id_panier,
      id_user: data.order.id_user,
      user_nom: data.order.user_nom,
      user_email: data.order.user_email,
      status_description: data.order.status_description
    },
    panier: data.panier,
    products: data.products.map((p: any) => ({
      id_prod: p.id_prod,
      nom_prod: p.nom_prod,
      prix_prod: p.prix_prod,
      stock_quantity: p.stock_quantity,
      cart_quantity: p.cart_quantity
    })),
    shipping: data.shipping,
    status_history: data.status_history.map((sh: any) => ({
      status: sh.status,
      created_at: sh.created_at,
      description: sh.description
    }))
  }
}

export async function getCommandesByClient(clientId: number): Promise<Order[]> {
  const response = await fetch(`${API_URL}/orders/user_orders.php${clientId === 0 ? '' : `?client_id=${clientId}`}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
    }
  })

  if (!response.ok) {
    throw new Error('Failed to fetch commandes for client')
  }

  const data = await response.json()
  return data.orders || []
}

// Contact API functions
export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  created_at: string;
  user_id?: number;
  user_name?: string;
  user_email?: string;
}

export async function submitContactMessage(message: Omit<ContactMessage, 'id' | 'status' | 'created_at'>): Promise<{ message: string }> {
  const token = localStorage.getItem('jwt_token');
  const response = await fetch(`${API_URL}/contact/submit.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(message)
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to submit message' }));
    throw new Error(error.message);
  }

  return response.json();
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const token = localStorage.getItem('jwt_token');
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_URL}/contact/read.php`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (response.status === 401) {
    throw new Error('Session expired. Please login again.');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch messages' }));
    throw new Error(error.message);
  }

  const data = await response.json();
  return data.records || [];
}

export async function getUserMessages(): Promise<ContactMessage[]> {
  const token = localStorage.getItem('jwt_token');
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_URL}/contact/read_user_messages.php`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (response.status === 401) {
    throw new Error('Session expired. Please login again.');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch messages' }));
    throw new Error(error.message);
  }

  const data = await response.json();
  return data.records || [];
}

export async function updateMessageStatus(id: number, status: ContactMessage['status']): Promise<{ message: string }> {
  const token = localStorage.getItem('jwt_token');
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_URL}/contact/update_status.php`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ id, status }),
   
  });

  if (response.status === 401) {
    throw new Error('Session expired. Please login again.');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to update message status' }));
    throw new Error(error.message);
  }

  return response.json();
}

export async function updateOrderStatus(orderId: number, status: string, description?: string): Promise<{ message: string; status: string }> {
  const response = await fetch(`${API_URL}/orders/update_status.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
    },
    body: JSON.stringify({
      order_id: orderId,
      status,
      description
    })
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to update order status' }))
    throw new Error(error.message)
  }

  return response.json()
}
