import { RouterComponents } from "./router";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "react-query";
import GlobalStyle from "./GlobalStyle";
import "./index.css";
function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <div
        className="test"
        style={{
          fontFamily: "Lexend Deca, sans- serif",
        }}
      >
        <GlobalStyle />
        <RouterComponents />
      </div>
    </QueryClientProvider>
  );
}

export default App;
