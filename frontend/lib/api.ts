import { Product } from './data'

const API_URL = 'http://localhost:8000/api'

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
  const response = await fetch(`${API_URL}/products/create.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
    },
    body: JSON.stringify(product)
  });

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
    images: data.images || [], // Use images if provided, otherwise empty array
    details: data.details
  };
}

export async function updateProduct(id: number, product: Partial<Product>): Promise<Product> {
  const response = await fetch(`${API_URL}/products/update.php`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
    },
    body: JSON.stringify({ id_prod: id, ...product })
  })
  if (!response.ok) {
    throw new Error('Failed to update product')
  }
  const data = await response.json()
  return data
}

export async function deleteProduct(id: number): Promise<boolean> {
  const response = await fetch(`${API_URL}/products/delete.php?id=${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
    }
  })
  if (!response.ok) {
    throw new Error('Failed to delete product')
  }
  return true
}

export async function uploadProductImage(productId: number, imageFile: File): Promise<string> {
  if (!productId || !imageFile || imageFile.size === 0) {
    throw new Error('Product ID and valid image file are required')
  }

  const formData = new FormData()
  formData.append('product_id', productId.toString())
  // The PHP backend expects an array of images with name 'images'
  formData.append('images[]', imageFile)  // Correct array syntax for PHP

  console.log(`Uploading image for product ${productId}, file size: ${imageFile.size} bytes, name: ${imageFile.name}`)

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
  
  // The backend returns an array of uploaded files
  if (data.uploaded && data.uploaded.length > 0) {
    return data.uploaded[0] // Return the first uploaded image filename
  } else if (data.errors && data.errors.length > 0) {
    console.error('Image upload errors:', data.errors)
    throw new Error(`Failed to upload image: ${data.errors.join(', ')}`)
  }
  
  return ''
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