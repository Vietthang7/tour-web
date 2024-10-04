//tour -images
const tourImages = document.querySelector(".tour-images");
if (tourImages) {
  const swiper = new Swiper(".tour-images", {
    pagination: {
      el: ".swiper-pagination",
      dynamicBullets: true,
    },
  });
}
//Slide tour -images
