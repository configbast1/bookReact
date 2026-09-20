import { useQuery } from '@tanstack/react-query';
import { fetchAboutMe } from '@/services/aboutMeService.js';
import { queryKeys } from '@/lib/queryClient.js';

export default function useAboutMe() {
  return useQuery({
    queryKey: queryKeys.aboutMe,
    queryFn: ({ signal }) => fetchAboutMe({ signal }),
  });
}
