import ApplicationCard from "./ApplicationCard";

export default function ApplicationGrid({ applications }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {applications.map((application) => (
        <ApplicationCard key={application.slug} application={application} />
      ))}
    </div>
  );
}
