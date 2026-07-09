import ApplicationGrid from "./ApplicationGrid";

export default function ApplicationCategory({ category }) {
  return (
    <section>
      <div className="mb-10">
        <span className="text-xs uppercase tracking-[0.3em] text-[#8c1218]">
          Category
        </span>

        <h2 className="mt-3 text-3xl font-bold">{category.title}</h2>
      </div>

      <ApplicationGrid applications={category.applications} />
    </section>
  );
}
