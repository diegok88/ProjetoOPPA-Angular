/* CONSTANTE COM A FINALIDADE DE TRANSFORMAR A PRIMEIRA LETRA EM MAIUSCULA */
export const FormatarCampos = (field: string): string => {
  if (!field) return '';
  return field.charAt(0).toUpperCase() + field.slice(1);
};
