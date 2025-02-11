import { Stack } from 'expo-router';

export default function SprueLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Sprue Details',
          headerBackTitle: 'Back',
        }}
      />
    </Stack>
  );
}
