/* [grial-metadata] id: Grial#NewsDetailPage.cs version: 1.0.1 */
namespace FitnessApp.Views;

public partial class DetailPage : ContentPage
{
    public DetailPage()
    {
        InitializeComponent();

        BindingContext = new DetailViewModel();
    }

    public DetailPage(NewsArticleData article)
    {
        InitializeComponent();

        BindingContext = new DetailViewModel(article);
    }
}
