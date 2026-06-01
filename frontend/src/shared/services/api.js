import { supabase } from './supabaseClient';

const validateProductData = (data) => {
  if (data.price !== undefined && data.price < 0) {
    throw new Error('El precio no puede ser negativo.');
  }
  if (data.stock !== undefined && data.stock < 0) {
    throw new Error('El stock no puede ser negativo.');
  }
  if (data.name !== undefined) {
    if (typeof data.name !== 'string' || data.name.trim() === '') {
      throw new Error('El nombre del producto es obligatorio y no puede estar vacío.');
    }
    if (data.name.length > 255) {
      throw new Error('El nombre del producto es demasiado largo.');
    }
  }
};

export const catalogApi = {
  // GET ALL PRODUCTS (CON FILTRO DESDE BACKEND)
  getProducts: async (storeType = 'todos') => {
    let query = supabase
      .from('products')
      .select('*')
      .order('id', { ascending: false });
    
    if (storeType !== 'todos') {
      query = query.eq('storeType', storeType);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }
    return data;
  },

  // CREATE PRODUCT
  addProduct: async (producto) => {
    validateProductData(producto);
    // Eliminamos el ID para que Supabase lo genere automáticamente (identity/uuid)
    const { id, ...productoSinId } = producto;
    
    const { data, error } = await supabase
      .from('products')
      .insert([productoSinId])
      .select();
      
    if (error) throw new Error(error.message);
    return data[0];
  },

  // UPDATE PRODUCT
  updateProduct: async (id, updatedFields) => {
    validateProductData(updatedFields);
    const { id: _, ...fieldsToUpdate } = updatedFields;
    
    const { data, error } = await supabase
      .from('products')
      .update(fieldsToUpdate)
      .eq('id', id)
      .select();
      
    if (error) throw new Error(error.message);
    return data[0];
  },

  // UPLOAD IMAGE TO SUPABASE STORAGE
  uploadImage: async (file) => {
    // Validación de seguridad para archivos
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Tipo de archivo no permitido. Solo se aceptan imágenes (JPG, PNG, WEBP).');
    }
    const maxSizeBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSizeBytes) {
      throw new Error('La imagen es demasiado grande. Máximo 5MB permitidos.');
    }

    const fileExt = file.name.split('.').pop().toLowerCase();
    const allowedExts = ['jpg', 'jpeg', 'png', 'webp'];
    if (!allowedExts.includes(fileExt)) {
      throw new Error('Extensión de archivo inválida.');
    }

    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `public/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) {
      throw new Error('Error al subir la imagen: ' + uploadError.message);
    }

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  // DELETE PRODUCT
  deleteProduct: async (id) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
      
    if (error) throw new Error(error.message);
    return true;
  }
};

export const authApi = {
  // LOGIN CON SUPABASE AUTH
  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw new Error(error.message);
    
    return { success: true, user: data.user };
  },
  
  logout: async () => {
    await supabase.auth.signOut();
  }
};
