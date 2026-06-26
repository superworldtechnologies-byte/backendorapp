export function ReviewList({ reviews }: { reviews: any[] }) {
  if (!reviews.length) {
    return (
      <div className="rounded-xl border border-dashed p-6">
        <p className="text-sm text-muted-foreground">No reviews yet for this service.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {reviews.map((review) => (
        <div key={review.id} className="rounded-xl border p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-medium">{review.customerName || "Customer"}</p>
              <p className="text-sm text-muted-foreground">
                {review.petName ? `Pet: ${review.petName}` : ""}
              </p>
            </div>

            <div className="text-sm font-medium">{review.rating || 0}/5</div>
          </div>

          <p className="mt-3 text-sm text-muted-foreground">
            {review.comment || "No comment"}
          </p>
        </div>
      ))}
    </div>
  );
}