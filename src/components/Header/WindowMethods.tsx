export default function windowMethods(){
    if (typeof window !== 'undefined') {

      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark')
        document.cookie = "theme=dark"
      }
      else {
        document.documentElement.classList.remove('dark')
        document.cookie = "theme=light"
      }
    }
  }