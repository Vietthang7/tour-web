export const formatDateTimeLocal = (date) => {
  const localDate = new Date(date); // Tạo đối tượng Date từ chuỗi  
  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, '0');
  const day = String(localDate.getDate()).padStart(2, '0');
  const hours = String(localDate.getHours()).padStart(2, '0');
  const minutes = String(localDate.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`; // Trả về định dạng YYYY-MM-DDTHH:MM  
}  