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
  // GET ALL PRODUCTS
  getProducts: async (storeType = 'todos') => {
    let query = supabase
      .from('products')
      .select('*')
      .order('id', { ascending: false });

    if (storeType !== 'todos') {
      query = query.eq('storeType', storeType);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // CREATE PRODUCT
  addProduct: async (producto) => {
    validateProductData(producto);
    
    const { data, error } = await supabase
      .from('products')
      .insert([producto])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // UPDATE PRODUCT
  updateProduct: async (id, updatedFields) => {
    validateProductData(updatedFields);

    const { data, error } = await supabase
      .from('products')
      .update(updatedFields)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // UPLOAD IMAGE TO SUPABASE STORAGE
  uploadImage: async (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Tipo de archivo no permitido. Solo se aceptan imágenes (JPG, PNG, WEBP).');
    }
    const maxSizeBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSizeBytes) {
      throw new Error('La imagen es demasiado grande. Máximo 5MB permitidos.');
    }

    // Generate unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `public/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('catalogo')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage
      .from('catalogo')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  },

  // DELETE PRODUCT
  deleteProduct: async (id) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};

export const authApi = {
  // LOGIN SUPABASE
  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return { success: true, user: data.user };
  },
  
  // LOGOUT SUPABASE
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
};
