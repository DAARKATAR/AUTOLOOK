import { supabase } from './supabaseClient';

const validateProductData = (data) => {
  if (data.price !== undefined && data.price < 0) {
    throw new Error('El precio no puede ser negativo.');
  }
  if (data.priceMax !== undefined && data.priceMax !== '' && data.priceMax !== null) {
    if (Number(data.priceMax) < 0) throw new Error('El precio máximo no puede ser negativo.');
    if (data.price !== undefined && Number(data.priceMax) < Number(data.price)) {
      throw new Error('El precio máximo no puede ser menor al precio mínimo.');
    }
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
  getProducts: async (storeType = 'todos', limit = null, offset = 0) => {
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .order('id', { ascending: false });

    if (storeType !== 'todos') {
      query = query.eq('storeType', storeType);
    }

    if (limit) {
      query = query.range(offset, offset + limit - 1);
    }

    const { data, count, error } = await query;
    if (error) throw error;
    return { data, count };
  },

  // CREATE PRODUCT
  addProduct: async (producto) => {
    validateProductData(producto);
    
    // Eliminar 'id' y transformar priceMax
    const { id, priceMax, ...rest } = producto;
    const dataToInsert = { ...rest };
    if (priceMax !== undefined && priceMax !== '') {
      dataToInsert.price_max = Number(priceMax);
    } else {
      dataToInsert.price_max = null;
    }
    
    const { data, error } = await supabase
      .from('products')
      .insert([dataToInsert])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // UPDATE PRODUCT
  updateProduct: async (id, updatedFields) => {
    validateProductData(updatedFields);

    const { priceMax, ...rest } = updatedFields;
    const dataToUpdate = { ...rest };
    if (priceMax !== undefined) {
      dataToUpdate.price_max = priceMax === '' ? null : Number(priceMax);
    }

    const { data, error } = await supabase
      .from('products')
      .update(dataToUpdate)
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
    // 1. Obtener la URL de la imagen antes de borrar el producto
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('imageUrl')
      .eq('id', id)
      .single();
      
    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    // 2. Si tiene imagen, eliminarla del Storage
    if (product && product.imageUrl) {
      // Extraer el path interno (ej: "public/archivo.png") de la URL completa
      const urlParts = product.imageUrl.split('/catalogo/');
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        // Borrar imagen del bucket (no arrojamos error si falla, solo registramos, para no bloquear el borrado del producto)
        const { error: storageError } = await supabase.storage
          .from('catalogo')
          .remove([filePath]);
          
        if (storageError) {
          console.warn('No se pudo borrar la imagen del storage:', storageError);
        }
      }
    }

    // 3. Borrar el registro de la base de datos
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
