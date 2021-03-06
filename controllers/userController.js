const Order = require("../models/order.model");
const OrderDetail = require("../models/orderDetail.model");
const User = require("../models/user.model");
const axios = require("axios");

class UserController {
  // static async createUser(req, res, next) {
  //   try {
  //     const { fullName, email, password, phoneNumber, profilePicture } =
  //       req.body

  //     const users = await User.create({
  //       fullName,
  //       email,
  //       password,
  //       phoneNumber,
  //       profilePicture,
  //       role: 'Customers',
  //     })

  //     res.status(201).json(users)
  //   } catch (error) {
  //     console.log(error)
  //     next(error)
  //   }
  // }

  // static async fetchUsers(req, res, next) {
  //   try {
  //     const users = await User.find()
  //     res.status(200).json(users)
  //   } catch (error) {
  //     console.log(error)
  //     next(error)
  //   }
  // }

  // static async findUser(req, res, next) {
  //   try {
  //     const { id } = req.params
  //     const users = await User.findById(id)
  //     res.status(200).json(users)
  //   } catch (error) {
  //     console.log(error)
  //     next(error)
  //   }
  // }

  // static async deleteUser(req, res, next) {
  //   try {
  //     const { id } = req.params
  //     const users = await User.findById(id)
  //     if (!users) {
  //       console.log('user not found')
  //     } else {
  //       await User.deleteOne()
  //       res.status(200).json({ message: 'User success deleted' })
  //     }
  //   } catch (error) {
  //     console.log(error)
  //     next(error)
  //   }
  // }

  // static async updateUser(req, res, next) {
  //   try {
  //     const { id } = req.params
  //     const { fullName, email, password, phoneNumber, profilePicture } =
  //       req.body
  //     const users = await User.findById(id)
  //     if (!users) {
  //       console.log('user not found')
  //     } else {
  //       const updateUser = await User.updateOne({
  //         fullName,
  //         email,
  //         password,
  //         phoneNumber,
  //         profilePicture,
  //       })
  //       res.status(200).json({ message: 'User success updated' })
  //     }
  //   } catch (error) {
  //     console.log(error)
  //     next(error)
  //   }
  // }

  static async order(req, res, next) {
    try {
      console.log(req.body);

      let status = "Unpaid";

      const {
        customerName,
        customerPhoneNumber,
        customerEmail,
        tableNumber,
        totalPrice,
        bookingDate,
        numberOfPeople,
        restaurantId,
        orderDetails,
      } = req.body;

      if (bookingDate) status = "Booked";

      const order = await Order.create({
        customerName,
        customerPhoneNumber,
        customerEmail,
        tableNumber,
        totalPrice,
        bookingDate,
        numberOfPeople,
        restaurantId,
        status,
      });

      if (orderDetails) {
        orderDetails.forEach(async (item) => {
          const orderDetail = await OrderDetail.create({
            orderId: order._id,
            itemId: item.itemId,
            quantity: item.quantity,
          });
        });

        const responseXendit = await axios({
          url: "https://api.xendit.co/v2/invoices",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: process.env.XENDIT_KEY,
          },
          data: {
            external_id: order._id,
            amount: order.totalPrice,
            customer: {
              given_names: order.customerName,
              email: order.customerEmail,
              mobile_number: order.customerPhoneNumber ? order.customerPhoneNumber : null,
            },
            description: `Invoice ${order._id} for Restaurant ${order.restaurantId} and table number ${order.tableNumber}`,
            should_send_email: true,
          },
        });
        let responseUrl = responseXendit.data.invoice_url;

        res.status(201).json({
          url: responseUrl,
          orderId: order._id,
        });
        return;
      }
      res.status(200).json("Booking Success");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
