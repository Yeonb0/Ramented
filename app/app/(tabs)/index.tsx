import { Text, View } from "react-native";
import { useQuery } from "@tanstack/react-query";

const API_URL = "http://192.168.200.162:8080";

export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["health"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/health`);
      if (!res.ok) throw new Error("서버 응답 실패");
      return res.json();
    },
  });

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {isLoading && <Text>불러오는 중...</Text>}
      {error && <Text>에러: {error.message}</Text>}
      {data && <Text>백엔드 상태: {data.status}</Text>}
    </View>
  );
}