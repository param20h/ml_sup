import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { checkUrl } from '../api/checkUrl';
import styles from './InputForm.module.css';

const InputForm = ({ setResult }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = React.useState(false);


  const onSubmit = async (data) => {
    toast.info("Checking URL, hang tight...");
    setLoading(true);
  
    try {
      const response = await checkUrl(data.url);
      setResult(response);
      saveToLocalStorage(data.url, response);
      toast.success("URL checked successfully!");
      reset();
    } catch (error) {
      toast.error("Something went wrong. API might be sleeping.");
    } finally {
      setLoading(false);
    }
  };
  const saveToLocalStorage = (url, result) => {
    const history = JSON.parse(localStorage.getItem('urlHistory')) || [];
    history.unshift({ url, result, time: new Date().toISOString() });
    localStorage.setItem('urlHistory', JSON.stringify(history.slice(0, 10)));
  };
  

  return (
    <motion.form
      className={styles.form}
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <input
        type="text"
        placeholder="Enter URL..."
        {...register("url", { required: true, pattern: /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,6})(\/[\w .-]*)*\/?$/ })}
        className={styles.input}
      />
      {errors.url && <p className={styles.error}>Enter a valid URL.</p>}

      {loading ? (
  <div className={styles.spinner}></div>
) : (
  <button type="submit" className={styles.button}>Check Now</button>
)}

    </motion.form>
  );
};

export default InputForm;
