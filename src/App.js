import { RouterComponents } from "./router";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "react-query";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <div
        className="test"
        style={{
          fontFamily: "Open Sans, sans - serif",
        }}
      >
        <RouterComponents />
      </div>
    </QueryClientProvider>
  );
}

export default App;
