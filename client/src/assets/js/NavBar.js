document.addEventListener("DOMContentLoaded", () => {
	const menuIcon = document.querySelector(".menu-icon");
	const nav = document.querySelector("nav");
  
	menuIcon.addEventListener("click", () => {
	  document.querySelector("nav ul").classList.toggle("showing");
	});
  
	// Scroll Effect
	window.addEventListener("scroll", () => {
	  if (window.scrollY > 0) {
		nav.classList.add("black");
	  } else {
		nav.classList.remove("black");
	  }
	});
  });
  