import ContactForm from "@/components/ContactForm"

export default function Contact() {
  return (
    <section className="py-16 px-4 bg-light-bg">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-center mb-2">Contactez-nous</h1>
        <p className="text-center text-gray-600 mb-10">
          Au cœur de la lune est un espace pensé pour les enfants de la lune. Vêtements adaptés, alimentation saine, et
          soutien psychologique : tout est réuni pour vous accompagner chaque jour, avec cœur et attention.
        </p>

        <ContactForm />
      </div>
    </section>
  )
}
