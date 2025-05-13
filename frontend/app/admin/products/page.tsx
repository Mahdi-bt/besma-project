'use client'

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { getProducts, createProduct, updateProduct, deleteProduct, uploadProductImage, deleteProductImage, getCategories, type Category, type Product } from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import ReturnButton from "@/components/ReturnButton"

// Feature input interface
interface Feature {
  name: string;
  value: string;
}

// FeatureInput component
const FeatureInput = ({ 
  initialFeatures = {}, 
  onChange 
}: { 
  initialFeatures: Record<string, any>,
  onChange: (features: Record<string, any>) => void 
}) => {
  const [features, setFeatures] = useState<Feature[]>(() => {
    // Convert initial features object to array of name-value pairs
    return Object.entries(initialFeatures).map(([name, value]) => ({
      name,
      value: String(value)
    }));
  });

  // Update features when initialFeatures changes
  useEffect(() => {
    setFeatures(Object.entries(initialFeatures).map(([name, value]) => ({
      name,
      value: String(value)
    })));
  }, [initialFeatures]);

  const addFeature = () => {
    setFeatures([...features, { name: '', value: '' }]);
  };

  const removeFeature = (index: number) => {
    const newFeatures = features.filter((_, i) => i !== index);
    setFeatures(newFeatures);
    
    // Convert and trigger onChange
    const featuresObject = newFeatures.reduce((obj, feature) => {
      if (feature.name.trim()) {
        obj[feature.name] = feature.value;
      }
      return obj;
    }, {} as Record<string, any>);
    
    onChange(featuresObject);
  };

  const updateFeature = (index: number, field: 'name' | 'value', value: string) => {
    const newFeatures = [...features];
    newFeatures[index][field] = value;
    setFeatures(newFeatures);

    // Convert features array to object and trigger onChange
    const featuresObject = newFeatures.reduce((obj, feature) => {
      if (feature.name.trim()) {
        obj[feature.name] = feature.value;
      }
      return obj;
    }, {} as Record<string, any>);
    
    onChange(featuresObject);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">Caractéristiques</label>
        <button
          type="button"
          onClick={addFeature}
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark"
        >
          <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Ajouter
        </button>
      </div>
      
      <div className="space-y-3">
        {features.map((feature, index) => (
          <div key={index} className="flex gap-2 items-start">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Nom"
                value={feature.name}
                onChange={(e) => updateFeature(index, 'name', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="Valeur"
                value={feature.value}
                onChange={(e) => updateFeature(index, 'value', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
            <button
              type="button"
              onClick={() => removeFeature(index)}
              className="mt-1 inline-flex items-center p-1.5 border border-transparent rounded-full text-red-600 hover:bg-red-50 focus:outline-none"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
        {features.length === 0 && (
          <p className="text-sm text-gray-500 italic">Aucune caractéristique ajoutée</p>
        )}
      </div>
    </div>
  );
};

export default function ProductsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [filterCategory, setFilterCategory] = useState<number | "all">("all")
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isDeletingImage, setIsDeletingImage] = useState(false)
  // Validate image file before uploading
  const validateImageFile = (file: File | null): boolean => {
    // If no file or empty file input (user didn't select a file), return true to proceed without image
    if (!file || file.size === 0) {
      return true
    }
    
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setError(`Invalid file type: ${file.type}. Please use JPG, PNG, GIF or WebP.`)
      return false
    }
    
    // Maximum file size (5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      setError(`File size too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum size is 5MB.`)
      return false
    }
    
    return true
  }

  const validateFeatures = (jsonString: string): boolean => {
    try {
      if (!jsonString.trim()) return true; // Empty is OK
      JSON.parse(jsonString);
      return true;
    } catch (e) {
      setError('Format JSON invalide pour les caractéristiques');
      return false;
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== 'admin') {
      router.push('/connexion')
      return
    }

    // Load products and categories
    const loadData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories()
        ])
        setProducts(productsData)
        setCategories(categoriesData)
      } catch (err) {
        setError('Failed to load data')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [router, isAuthenticated, user])

  const handleOpenModal = (product: Product) => {
    console.log(product)
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true)
  }

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false)
  }
  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsUploading(true)
    try {
      const formData = new FormData(e.currentTarget)
      
      // Get the file from the file input
      const imageFiles = formData.getAll('image') as File[]
      
      // Only validate if files were selected
      if (imageFiles.length > 0 && !imageFiles.every(file => validateImageFile(file))) {
        setIsUploading(false)
        return
      }

      const newProduct = {
        nom_prod: formData.get('name') as string,
        description_prod: formData.get('description') as string,
        prix_prod: parseFloat(formData.get('price') as string),
        qte_prod: parseInt(formData.get('stock') as string),
        categorie_id: parseInt(formData.get('category') as string),
        features: JSON.parse(formData.get('features-data') as string || '{}')
      }

      console.log('Creating new product:', newProduct)
      const addedProduct = await createProduct(newProduct)
      console.log('Product created successfully:', addedProduct)
      
      // If there are images to upload
      if (imageFiles.length > 0 && imageFiles[0].size > 0) {
        try {
          console.log(`Uploading images for new product ${addedProduct.id}, total size: ${imageFiles.reduce((total, file) => total + file.size, 0)} bytes`)
          const imageFilenames = await uploadProductImage(addedProduct.id, imageFiles)
          console.log('Image filenames received:', imageFilenames)
          
          // Update the product with the new images
          addedProduct.images = imageFilenames.map((filename, index) => ({
            id: index,
            url: filename
          }))
        } catch (err) {
          console.error('Failed to upload images:', err)
          setError('Product added but images upload failed')
        }
      }

      setProducts(prev => [...prev, addedProduct])
      handleCloseAddModal()
    } catch (err) {
      setError('Failed to add product')
      console.error(err)
    } finally {
      setIsUploading(false)
    }
  }
  const handleUpdateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedProduct) return
    setError(null)
    setIsUploading(true)
    try {
      const formData = new FormData(e.currentTarget)

      const updatedProduct = {
        nom_prod: formData.get('name') as string,
        description_prod: formData.get('description') as string,
        prix_prod: parseFloat(formData.get('price') as string),
        qte_prod: parseInt(formData.get('stock') as string),
        categorie_id: parseInt(formData.get('category') as string),
        features: JSON.parse(formData.get('features-data') as string || '{}')
      }

      console.log('Updating product:', selectedProduct.id, updatedProduct)
      const result = await updateProduct(selectedProduct.id, updatedProduct)
      console.log('Product updated successfully:', result)

      // If there are new images to upload
      const imageFiles = formData.getAll('image') as File[]
      if (imageFiles.length > 0 && imageFiles[0].size > 0) {
        try {
          console.log(`Uploading images for product ${result.id}, total size: ${imageFiles.reduce((total, file) => total + file.size, 0)} bytes`)
          const imageFilenames = await uploadProductImage(result.id, imageFiles)
          console.log('Image filenames received:', imageFilenames)
          
          // Add new images to existing ones
          result.images = [
            ...result.images,
            ...imageFilenames.map((filename, index) => ({
              id: result.images.length + index,
              url: filename
            }))
          ]
        } catch (err) {
          console.error('Failed to upload images during update:', err)
          setError('Product updated but images upload failed')
        }
      }

      // Update the products state with the new data
      setProducts(prev => prev.map(p => p.id === result.id ? result : p))
      handleCloseModal()
    } catch (err) {
      console.error('Failed to update product:', err)
      setError(err instanceof Error ? err.message : 'Failed to update product')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await deleteProduct(id)
        setProducts(prev => prev.filter(p => p.id !== id))
      } catch (err) {
        setError('Failed to delete product')
        console.error(err)
      }
    }
  }

  const filteredProducts = filterCategory === "all" 
    ? products 
    : products.filter(product => product.categorie_id === filterCategory)

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(c => c.id_categorie === categoryId)
    return category ? category.nom_categorie : 'Unknown'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <ReturnButton href="/admin/dashboard" />
              <h1 className="text-2xl font-bold text-gray-800">Gestion des Produits</h1>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value === "all" ? "all" : parseInt(e.target.value))}
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              >
                <option value="all">Toutes les catégories</option>
                {categories.map(category => (
                  <option key={category.id_categorie} value={category.id_categorie}>
                    {category.nom_categorie}
                  </option>
                ))}
              </select>
              <button
                onClick={handleOpenAddModal}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Ajouter un produit
              </button>
            </div>
          </div>
        </div>
      </header>      {/* Error Message */}
      {error && (
        <div className="container mx-auto px-4 py-2">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
            <button 
              onClick={() => setError(null)} 
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      #{product.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.nom_prod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {getCategoryName(product.categorie_id)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.prix_prod.toFixed(2)} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.qte_prod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleOpenModal(product)}
                        className="text-primary hover:text-primary-dark mr-4"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Supprimer
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      <AnimatePresence>
        {isModalOpen && selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Modifier le produit
              </h2>

              <form onSubmit={handleUpdateProduct} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nom</label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={selectedProduct.nom_prod}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Prix</label>
                    <input
                      type="number"
                      name="price"
                      step="0.01"
                      defaultValue={selectedProduct.prix_prod}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Catégorie</label>
                    <select
                      name="category"
                      defaultValue={selectedProduct.categorie_id}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      required
                    >
                      {categories.map(category => (
                        <option key={category.id_categorie} value={category.id_categorie}>
                          {category.nom_categorie}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Stock</label>
                    <input
                      type="number"
                      name="stock"
                      defaultValue={selectedProduct.qte_prod}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      name="description"
                      defaultValue={selectedProduct.description_prod}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>                  <div>
                    <label className="block text-sm font-medium text-gray-700">Images</label>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      multiple // Allow multiple file selection
                      className="mt-1 block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-primary file:text-white
                        hover:file:bg-primary-dark"
                    />
                    <p className="text-xs text-gray-500 mt-1">Optional. Multiple images supported. Formats: JPG, PNG, GIF, WebP</p>
                    {selectedProduct?.images && selectedProduct.images.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">Images actuelles:</p>
                        <div className="grid grid-cols-4 gap-2 mt-1">
                          {selectedProduct.images.map((image, index) => (
                            <div key={index} className="relative group">
                              <img 
                                src={`http://localhost:8000/uploads/products/${image.url}`} 
                                alt={`${selectedProduct.nom_prod} - ${index + 1}`}
                                className="h-20 w-20 object-cover rounded-lg"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <input 
                    type="hidden" 
                    name="features-data" 
                    id="features-data" 
                  />
                  <FeatureInput
                    initialFeatures={selectedProduct.features || {}}
                    onChange={(features) => {
                      const input = document.getElementById('features-data') as HTMLInputElement;
                      input.value = JSON.stringify(features);
                    }}
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Annuler
                  </button>                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                    disabled={isUploading}
                  >
                    {isUploading ? 'Chargement...' : 'Enregistrer'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Ajouter un produit
              </h2>

              <form onSubmit={handleAddProduct} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nom</label>
                    <input
                      type="text"
                      name="name"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Prix</label>
                    <input
                      type="number"
                      name="price"
                      step="0.01"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Catégorie</label>
                    <select
                      name="category"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      required
                    >
                      {categories.map(category => (
                        <option key={category.id_categorie} value={category.id_categorie}>
                          {category.nom_categorie}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Stock</label>
                    <input
                      type="number"
                      name="stock"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      name="description"
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>                  <div>
                    <label className="block text-sm font-medium text-gray-700">Images</label>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      multiple // Allow multiple file selection
                      className="mt-1 block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-primary file:text-white
                        hover:file:bg-primary-dark"
                    />
                    <p className="text-xs text-gray-500 mt-1">Optional. Multiple images supported. Formats: JPG, PNG, GIF, WebP</p>
                  </div>
                  <input 
                    type="hidden" 
                    name="features-data" 
                    id="features-data-new" 
                  />
                  <FeatureInput
                    initialFeatures={{}}
                    onChange={(features) => {
                      const input = document.getElementById('features-data-new') as HTMLInputElement;
                      input.value = JSON.stringify(features);
                    }}
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={handleCloseAddModal}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Annuler
                  </button>                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                    disabled={isUploading}
                  >
                    {isUploading ? 'Chargement...' : 'Ajouter'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}