INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE lower(email) = lower('hj96dobson@gmail.com')
ON CONFLICT (user_id, role) DO NOTHING;