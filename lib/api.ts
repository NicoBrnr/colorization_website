export interface ColorizeOptions {
  model?: 'artistic' | 'stable';
  renderFactor?: number;
  postProcess?: boolean;
}

export interface ColorizeResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

export async function colorizeImage(
  file: File,
  options: ColorizeOptions = {}
): Promise<ColorizeResponse> {
  const formData = new FormData();
  formData.append('file', file);
  
  if (options.model) {
    formData.append('model', options.model);
  }
  if (options.renderFactor) {
    formData.append('render_factor', options.renderFactor.toString());
  }
  if (options.postProcess !== undefined) {
    formData.append('post_process', options.postProcess.toString());
  }

  try {
    const response = await fetch('/api/colorize', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error || `Erreur serveur: ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      imageUrl: data.imageUrl,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur de connexion',
    };
  }
}
