import Image from "next/image";
import Link from "next/link";
import bannerImg from "@/assets/hero.jpg";

const Banner = () => {
  return (
    <section className="px-4 py-10 md:py-16">
      <div className="container mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-4xl bg-linear-to-br from-emerald-50 via-white to-green-100 px-6 py-10 md:px-12 md:py-14">
          {/* Decorative background */}
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-green-200/40 blur-3xl" />
          <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-emerald-200/40 blur-3xl" />

          <div className="relative grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-14">
            {/* Left content */}
            <div className="space-y-6">
              <span className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm ring-1 ring-emerald-100">
                Discover your next favorite book
              </span>

              <h2 className="max-w-xl text-4xl font-extrabold leading-tight tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
                Books to freshen up{" "}
                <span className="text-emerald-600">your bookshelf.</span>
              </h2>

              <p className="max-w-lg text-base leading-7 text-gray-600 md:text-lg">
                Explore a hand-picked collection of books and find stories that
                inspire, entertain, and stay with you.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/listed-books"
                  className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-600/20 transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-700"
                >
                  Visit The List →
                </Link>

                <Link
                  href="#books"
                  className="rounded-xl border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 transition duration-300 hover:border-emerald-300 hover:text-emerald-600"
                >
                  Explore Books
                </Link>
              </div>

              {/* Small stats */}
              <div className="flex flex-wrap gap-8 pt-4">
                <div>
                  <p className="text-2xl font-bold text-gray-900">500+</p>
                  <p className="text-sm text-gray-500">Books</p>
                </div>

                <div>
                  <p className="text-2xl font-bold text-gray-900">50+</p>
                  <p className="text-sm text-gray-500">Authors</p>
                </div>

                <div>
                  <p className="text-2xl font-bold text-gray-900">4.9</p>
                  <p className="text-sm text-gray-500">Average Rating</p>
                </div>
              </div>
            </div>

            {/* Right image */}
            <div className="relative">
              <div className="absolute inset-0 rounded-3xl bg-emerald-300/20 blur-2xl" />

              <div className="relative overflow-hidden rounded-3xl bg-white p-3 shadow-2xl shadow-emerald-900/10">
                <Image
                  src={bannerImg}
                  alt="Books collection"
                  priority
                  className="h-auto w-full rounded-2xl object-cover transition duration-500 hover:scale-[1.02]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
