import { supabase } from './supabaseClient';

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
    const fileExt = file.name.split('.').pop();
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
