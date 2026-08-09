interface Customer {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
}

interface CustomerUserError {
  field: string[] | null;
  message: string;
}
