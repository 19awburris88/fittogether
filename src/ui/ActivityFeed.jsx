import { useQuery } from "@tanstack/react-query";
import { ds } from "../lib/dataSource";
import { Card, CardContent, List, ListItem, ListItemText, Typography, Skeleton } from "@mui/material";

function timeAgo(ts){
  const d = Math.floor((Date.now()-ts)/1000);
  if (d<60) return `${d}s ago`;
  const m = Math.floor(d/60);
  if (m<60) return `${m}m ago`;
  const h = Math.floor(m/60);
  return `${h}h ago`;
}

export default function ActivityFeed(){
  const { data } = useQuery({ queryKey: ["activity"], queryFn: ds.getActivity });
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 1 }}>Recent Activity</Typography>
        {!data ? (
          <>
            <Skeleton variant="text" width="70%" />
            <Skeleton variant="text" width="50%" />
            <Skeleton variant="text" width="60%" />
          </>
        ) : (
          <List dense>
            {data.map(a => (
              <ListItem key={a.id} disableGutters>
                <ListItemText primary={`${a.who} ${a.text}`} secondary={timeAgo(a.ts)} />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}
