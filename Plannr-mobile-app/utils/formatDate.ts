import { format } from "date-fns";

  // Utility to format date safely
  const formatDate = (dateStr?: string) =>
    dateStr ? format(new Date(dateStr), "d MMM yyyy, HH:mm:ss") : "N/A";

  export default formatDate;

