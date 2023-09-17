import usePageTitle from "../hooks/usePageTitle";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Input from "../components/input";
import GoogleIcon from "../icons/google";
import AppleIcon from "../icons/apple";
import FacebookIcon from "../icons/facebook";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  staySignedIn: z.boolean(),
});

type FormType = z.infer<typeof formSchema>;

const SignInPage = () => {
  usePageTitle("Sign In");

  const onSubmit = (data: FormType) => {
    console.log(data);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(formSchema),
  });

  return (
    <div className="mx-auto max-w-[500px]">
      <form className="flex-grow basis-full" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Email"
          type="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Password"
          type="password"
          error={errors.password?.message}
          {...register("password")}
        />
        <button type="submit" className="btn btn-primary mt-4 w-full">
          Sign In
        </button>
      </form>
      <div className="divider my-6">OR</div>
      <div className="flex flex-grow basis-full flex-col gap-2">
        <button className="btn justify-start">
          <GoogleIcon className="h-5 w-5" />
          Sign In With Google
        </button>
        <button className="btn justify-start">
          <AppleIcon className="h-5 w-5" />
          Sign In With Apple
        </button>
        <button className="btn justify-start">
          <FacebookIcon className="h-5 w-5" />
          Sign In With Facebook
        </button>
      </div>
    </div>
  );
};

export default SignInPage;
