import { useEffect } from 'react'

// Agrega la clase "is-visible" a todo elemento con [data-reveal] cuando entra en pantalla.
// También toma los que aparecen después (por ejemplo, los eventos que llegan del panel).
export default function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    )
    const watch = (root) => {
      if (root.matches?.('[data-reveal]:not(.is-visible)')) observer.observe(root)
      root.querySelectorAll?.('[data-reveal]:not(.is-visible)').forEach((el) => observer.observe(el))
    }
    watch(document)

    const mutations = new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach(watch))
    })
    mutations.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutations.disconnect()
    }
  }, [])
}
